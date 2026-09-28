import {statSync} from 'node:fs';
import {join} from 'node:path';
import LazyVideo from './LazyVideo';
import {heroScene} from '@/lib/hero-scene';
export default function HeroMedia(){
 const sources=['webm','mp4'].filter(ext=>{try{return statSync(join(process.cwd(),'public',`gutter-flow.${ext}`)).size<=2*1024*1024}catch{return false}}).map(ext=>({src:`/gutter-flow.${ext}`,type:`video/${ext}`}));
 return <div className="landing-media">{sources.length?<LazyVideo sources={sources}/>:<div className="landing-scene" dangerouslySetInnerHTML={{__html:heroScene}}/>}</div>;
}
