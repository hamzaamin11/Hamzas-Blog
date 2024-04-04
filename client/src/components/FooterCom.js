import { Footer } from "flowbite-react";
import { FaFacebook, FaInstagram, FaGithub, FaDribbble } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    <div>
      <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-col-1">
            <div className="mt-5">
              {" "}
              <Link
                to={"/"}
                className=" self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
                  Hamza's
                </span>
                Blog
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href="https:www.100jsprojects.com"
                    target="blank"
                    rel="noopener noreferrer"
                  >
                    100 Js Projects
                  </Footer.Link>
                  <Footer.Link
                    href="/about"
                    target="blank"
                    rel="noopener noreferrer"
                  >
                    Hamza's Blogs
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="follow us" />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href="https:www.github.com"
                    target="blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </Footer.Link>
                  <Footer.Link href="#">Discord</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Term &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
              <Footer.Copyright
                href="#"
                by="Hamza's blog"
                year={new Date().getFullYear()}
              />
              <div className="flex gap-4 sm:mt-0 mt-4 md:justify-center">
                <Footer.Icon href="#" icon={FaFacebook} />
                <Footer.Icon href="#" icon={FaInstagram} />
                <Footer.Icon href="#" icon={FaGithub} />
                <Footer.Icon href="#" icon={FaDribbble} />
                <Footer.Icon href="#" icon={BsTwitterX} />
              </div>
            </div>
          </div>
      </Footer>
    </div>
  );
};

export default FooterCom;
