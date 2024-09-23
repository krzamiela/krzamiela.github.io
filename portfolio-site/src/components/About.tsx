import React from 'react';

export default function About() {
    return (
        <section id="about">
            <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
                        Hello, I'm Kathryn.
                        <br className="hidden lg:inline-block" />Premedicine Student and
                        <br className="hidden lg:inline-block" />Aspiring Endometriosis Researcher.
                    </h1>
                    <p className="mb-8 leading-relaxed">
                        Premedicine Student
                        <br className="hidden lg:inline-block" /><a href="https://linkedin.com/in/krzamiela">LinkedIn: krzamiela</a>
                        <br className="hidden lg:inline-block" /><a href="https://github.com/krzamiela">GitHub: krzamiela</a>
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="#contact"
                            className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">
                                Contact Me
                        </a>
                        <a
                            href="#projects"
                            className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg">
                                See My Past Work
                        </a>
                        <a
                            href="#skills"
                            className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg">
                                Skills and Technologies
                        </a>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <img
                    className="object-cover object-center rounded"
                    alt="Photo by Juanjo Jaramillo on Unsplash"
                    src="./juanjo-jaramillo-mZnx9429i94-unsplash.jpg"
                />
                </div>
            </div>
        </section>
    );
}
