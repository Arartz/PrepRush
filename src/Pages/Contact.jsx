import React from 'react'
import { FaFacebook, FaInstagram, FaGithub, FaWhatsapp, FaEnvelope, FaXTwitter } from 'react-icons/fa6'

function Contact() {
    const socials = [
        {
            name: 'Shimo Arnaud',            
            icon: <FaFacebook />,
            link: 'https://www.facebook.com/shimo.arnaud',
            color: 'text-blue-500'
        },
        {
            name: 'Shimo Arnaud',
            icon: <FaInstagram />,
            link: 'https://www.instagram.com/arakaze__/',
            color: 'text-pink-500'
        },
        {
            name: 'Shimo Arnaud',          
            icon: <FaGithub />,
            link: 'https://github.com/Arartz',
            color: 'text-gray-300'
        },
        {
            name: 'Shimo Arnaud',            
            icon: <FaWhatsapp />,
            link: 'https://wa.me/your_number',
            color: 'text-green-500'
        },
        {
            name: 'Shimo Arnaud',         
            icon: <FaEnvelope />,
            link: 'mailto:shimoarnaud22@gmail.com',
            color: 'text-yellow-400'
        },
        {
            name: 'Shimo Arnaud',     
            icon: <FaXTwitter />,
            link: 'https://x.com/Arartz_s',
            color: 'text-white'
        }
    ]

    return (
        <div className="h-171 bg-gray-900 flex items-center justify-center p-6">
            <div className="text-center max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-white mb-4">Reach Out To Us</h1>
                <p className="text-gray-400 mb-10">
                    Whether you’ve got questions, wanna collab, or just say hey — we’re just one click away ✨
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                    {socials.map((s, index) => (
                        <a
                            key={index}
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 hover:border-blue-500 ${s.color}`}
                        >
                            <div className="text-3xl">{s.icon}</div>
                            <span className="text-sm text-gray-300">{s.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Contact
