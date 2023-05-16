import Logo from '../src/assets/logo/404.svg';
import Image from "next/image";

export default function Home() {

	return (
        <main className="w-full h-screen flex flex-col justify-center items-center p-[24px]">
            <Image src={Logo} className='w-[90%] h-[80%]' loading="eager" priority={true} alt='logo' />
        </main>
	);
}
