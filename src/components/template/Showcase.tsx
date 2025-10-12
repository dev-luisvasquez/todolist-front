
// tools
import Image from 'next/image';

// Images
import backgroundImage from '../../../public/post-it-background.jpg';

// Components
import { SlideInfo } from '@/components/organism/SlidesInfo';

export function Showcase() {
    return (
        <div className="relative w-full md:w-1/2 lg:w-3/5 h-[50vh] md:h-full overflow-hidden rounded-b-[28px] md:rounded-none md:rounded-tr-[60px] md:rounded-br-[60px]">
            <Image src={backgroundImage} alt="Background" fill className="object-cover w-full h-full " priority />

            <div className="absolute inset-0 bg-black/50 p-4">
                <span className="text-white font-bold text-2xl">
                    Todo List App <span className="font-light">by Luis Vasquez</span>
                </span>
                <div className="max-w-2xl h-full flex flex-col items-center justify-center">
                    <span className="text-white text-3xl max-w-lg font-bold text-center mb-4">
                        Empieza hoy: convierte tus ideas en tareas y alcanza tus metas.
                    </span>
                    <SlideInfo />
                </div>
            </div>
        </div>
    );
}
