'use client';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Import Images
import organizationImage from '../../../public/organization.svg';
import tasksImage from '../../../public/tasklist.svg';
import estadisticImage from '../../../public/estadistics.svg';

export type SlideItem = {
    title: string;
    description?: string;
    logo?: string; // url
};

type SlideInfoProps = {
    slides?: SlideItem[];
    className?: string;
};

export const SlideInfo: React.FC<SlideInfoProps> = ({
    slides = [
        { title: 'Crea nuevas Tareas', description: 'Con el tablero de tareas mantendras el control de tus pendientes de manera eficiente.', logo: tasksImage },
        { title: 'Organiza tu Trabajo', description: 'Utiliza etiquetas de prioridad para clasificar tus tareas y mantener el enfoque.', logo:  organizationImage  },
        { title: 'Estadisticas y seguimiento', description: 'Obtén información valiosa sobre tu productividad y el progreso de tus tareas.', logo: estadisticImage },
    ],
   
}) => {
    return (
        <div className="max-w-lg h-9/12 bg-white/80 p-8 rounded-3xl hidden md:block">
            <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={true}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: false }}
                modules={[Pagination, Autoplay]}
                className='h-full'
            >
                {slides.map((s, i) => (
                    <SwiperSlide key={i}>
                        <div className="flex flex-col justify-between items-center text-center">
                            {s.logo && (
                                <div className="w-full flex justify-center ">
                                    <Image
                                        src={s.logo}
                                        alt={`${s.title} logo`}
                                        loading="lazy"
                                        width={350}
                                        height={200}
                                    />
                                </div>
                            )}
                            <div className="mt-2">
                                <h3 className="text-3xl font-semibold mb-2">{s.title}</h3>
                                {s.description && <p className="text-lg text-gray-700">{s.description}</p>}
                            </div>

                            
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
