import { Request, Response } from "express";
import { logError } from "../utilities/logger";

export const searchGoogle = async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const apiKeyExists = !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const cxExists = !!process.env.NEXT_PUBLIC_GOOGLE_CX;
    
    if (!apiKeyExists || !cxExists) {
      console.error('Missing required Google Search environment variables');
      return res.status(500).json({ 
        message: 'Server configuration error', 
        error: 'Missing required Google Search credentials' 
      });
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');
    url.searchParams.append('cx', process.env.NEXT_PUBLIC_GOOGLE_CX || '');
    url.searchParams.append('q', query + " site:axelarigato.com"); 
    url.searchParams.append('num', '10'); 
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
 
      throw new Error(`Google API responded with status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();

    const fetchProductDetails = async (link: string) => {
      try {
        const response = await fetch(link, { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          return null;
        }
        
        const html = await response.text();

        const pricePatterns = [
          /(\d+)\s*SEK/i,
          /price">\s*(\d[\d\s,.]*)\s*SEK/i,
          /price">\s*(\d[\d\s,.]*)\s*kr/i,
          /data-price="(\d+)"/i,
          /class="[^"]*price[^"]*"[^>]*>(?:[^<]*[^\d])?(\d[\d\s,.]*)\s*(?:SEK|Kr|kr|\$|€)/i,
          /"price"\s*:\s*["']?(\d+(?:\.\d+)?)["']?/i
        ];
        
        let price = null;
        for (const pattern of pricePatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            price = {
              value: parseFloat(match[1].replace(/[\s,.]+/g, '')),
              currency: 'SEK'
            };
  
            break;
          }
        }
        
        return price;
      } catch (error) {
        return null;
      }
    };
    
    const searchResults = await Promise.all(data.items?.map(async (item: any) => {
      const result = {
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
      };

      const priceRegexes = [
        /(\d+)\s*(SEK|EUR|USD|\$|€|kr)/i,
        /(\d+[\s\.,]\d+)\s*(SEK|EUR|USD|\$|€|kr)/i
      ];
      
      let priceMatch = null;
      for (const regex of priceRegexes) {
        priceMatch = item.snippet?.match(regex) || 
                    item.title?.match(regex) || 
                    (item.htmlSnippet?.replace(/<\/?[^>]+(>|$)/g, "").match(regex)) || 
                    (item.htmlTitle?.replace(/<\/?[^>]+(>|$)/g, "").match(regex));
        
        if (priceMatch) {
          console.log(`Price found in search result: ${priceMatch[0]} for item: ${result.title}`);
          break;
        }
      }
      
      if (priceMatch) {
        const cleanedPrice = priceMatch[1].replace(/[\s\.,]/g, '');
        result['price'] = {
          value: parseInt(cleanedPrice, 10),
          currency: priceMatch[2].toUpperCase() === 'KR' ? 'SEK' : priceMatch[2]
        };
      } else {
        // Om vi inte hittar pris i sökresultatet, gör en direkt förfrågan till produktsidan
        const productPrice = await fetchProductDetails(item.link);
        if (productPrice) {
          result['price'] = productPrice;
        }
      }
      
      const productIdMatch = item.link?.match(/\/([^\/]+?)(?:\/|\?|$)/);
      if (productIdMatch) {
        result['productId'] = productIdMatch[1];
      }

      if (item.pagemap) {
        if (item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
          result['imageUrl'] = item.pagemap.cse_image[0].src;
        } else if (item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail.length > 0) {
          result['imageUrl'] = item.pagemap.cse_thumbnail[0].src;
        } else if (item.pagemap.imageobject && item.pagemap.imageobject.length > 0) {
          result['imageUrl'] = item.pagemap.imageobject[0].url;
        } else if (item.pagemap.product && item.pagemap.product.length > 0 && item.pagemap.product[0].image) {
          result['imageUrl'] = item.pagemap.product[0].image;
        }
      }

      return result;
    }) || []);
    
    return res.status(200).json({ results: searchResults });
  } catch (error) {
    return res.status(500).json({ error: logError(error) });
  }
};