export const site = {
 name: 'Chaffee Exteriors', url: 'https://chaffeeexteriors.com',
 LICENSED: false, INSURED: false, WASH_RECLAIM: false,
 LICENSE_NUMBER: '', LEGAL_NAME: '', CITY_LICENSE_NUMBER: '',
 PHONE_MAIN: '(479) 492-4232', PHONE_HREF: 'tel:+14794924232', PHONE_SCHEMA: '+1-479-492-4232', EMAIL: 'andre@chaffeeexteriors.com', PHONE_BY_SOURCE: {} as Record<string,string>,
 SERVICE_AREAS: ['Fort Smith','Chaffee Crossing','Van Buren','Alma','Greenwood','Barling'],
 BOOKING_PROVIDER: 'aa' as 'cal' | 'aa',
 BOOKING_URL: 'https://book.arkansasautomated.com/book/chaffee-gutter-cleaning',
 BOOKING_BY_SERVICE: {
  cleaning: 'https://book.arkansasautomated.com/book/chaffee-gutter-cleaning',
  guards: 'https://book.arkansasautomated.com/book/chaffee-gutter-guards',
  repair: 'https://book.arkansasautomated.com/book/chaffee-repair',
  house: 'https://book.arkansasautomated.com/book/chaffee-house-wash',
  lights: 'https://book.arkansasautomated.com/book/chaffee-holiday-lights',
  porch: 'https://book.arkansasautomated.com/book/chaffee-porch-decor',
 } as const,
 OPENING_HOURS: [] as string[], // Set confirmed hours before publishing.
 RESEND_FROM: 'Chaffee Exteriors <leads@chaffeeexteriors.com>',
};
