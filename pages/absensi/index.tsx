import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Webcam from "react-webcam";

export default function Home() {
    const ref = useRef(null)
    const [s,setA] = useState<any>("")

    const a = () => {
        let as: any = ref.current
        setA(as.getScreenshot())
    }

	return (
		<main className='w-full flex items-center h-screen'>
			<Head>
				<title>DWITAMA E-WIS | Absensi</title>
			</Head>
			<div className='w-screen h-screen items-center justify-center flex space-x-2 bg-blue-200 p-6'>
                <div>
                    <Webcam ref={ref} audio={false} screenshotFormat="image/jpeg"/>
                    <button onClick={()=>a()}>Poto</button>
                </div>
                <img src={s}/>
			</div>
		</main>
	);
}
