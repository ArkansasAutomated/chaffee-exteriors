import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{
 return {name:'Chaffee Exteriors',short_name:'Chaffee',description:'Gutter cleaning, guards, repair and soft washing in Fort Smith, Arkansas.',start_url:'/',display:'standalone',background_color:'#F7F6EF',theme_color:'#172D35',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icon-512.png',sizes:'512x512',type:'image/png'}]};
}
