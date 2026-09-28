import {site} from '@/lib/site.config';
import LeadForm from './LeadForm';
export default function Booking(){return site.BOOKING_URL?<a className="button" href={site.BOOKING_URL} target="_blank" rel="noopener noreferrer">Choose an appointment ↗</a>:<><p>Send your preferred date and we’ll confirm the next available visit.</p><LeadForm/></>}
