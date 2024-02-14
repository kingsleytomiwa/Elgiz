import React from 'react';
import { cookies } from 'next/headers';
import initTranslations from '@/app/i18n';

const Numbers = async () => {
  const locale = cookies().get('NEXT_LOCALE')?.value;
  const { t } = await initTranslations(locale, ['landing-page']);

  return (
    <section className='mt-40 max-sm:mt-20 lg:max-w-[1440px] lg:mx-auto'>
      <div className='flex justify-evenly border-t-2 border-b-2  border-[#2B3467] py-10 max-sm:py-8 max-sm:grid max-sm:grid-cols-2 max-sm:place-content-center'>
        <div className='max-sm:ml-8 max-sm:pb-5'><span className='font-bold text-[32px] pr-1'>{t("guests")}</span></div>
        <div className='max-sm:ml-8 max-sm:order-2 '><span className='font-bold text-[32px] pr-1'>{t("requests")}</span></div>
        <div className='max-sm:ml-14'><span className='font-bold text-[32px] pr-1 '>{t("hotels")}</span></div>
        <div className='max-sm:ml-14 max-sm:order-2'><span className='font-bold text-[32px] pr-1 '>{t("countries")}</span></div>
      </div>
    </section>

  );
};

export default Numbers;