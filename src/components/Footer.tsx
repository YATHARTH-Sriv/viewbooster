import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";

const socialLinks = [
  { name: "GitHub", icon: FaGithub, url: "https://github.com", class:" rounded-md p-2 m-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12  hover:bg-black" },
  { name: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com" , class:" rounded-md p-2 m-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue hover:bg-black" },
  { name: "Instagram", icon: FaInstagram, url: "https://instagram.com" , class:" rounded-md p-2 m-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-purple hover:bg-black" },
  { name: "Twitter", icon: FaTwitter, url: "https://twitter.com", class:" rounded-md p-2 m-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue hover:bg-black" },
];

export default function Footer() {
  return (
    <footer className="bg-[#770c50] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-300"
              aria-label={`Visit our ${link.name} page`}
            >
              <link.icon
                className= {link.class}
              />
              <span className="sr-only">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
