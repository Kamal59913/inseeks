import React from 'react'
import { CloseSVG } from '../../Assets/close';
import { Input } from '../Input';

export default function Followpage() {
    
    const [group10337value, setGroup10337value] = React.useState("");

    return (
      <>
        <div className="bg-gray-50 flex flex-col font-gilroy sm:gap-10 md:gap-10 gap-[70px] items-center justify-end mx-auto pt-[35px] sm:px-5 px-[35px] w-full">
          <header className="flex items-center justify-center md:px-5 w-full">
            <div className="flex md:flex-col flex-row md:gap-5 items-center justify-center w-full">
              <div className="header-row my-2.5">
                <img
                  className="h-[35px]"
                  src="https://www.istockphoto.com/photo/businessman-using-computer-laptop-for-learning-online-internet-lessons-e-learning-gm1349094915-425831521?utm_source=pixabay&utm_medium=affiliate&utm_campaign=SRP_image_sponsored&utm_content=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Furl%2F&utm_term=url"
                  alt="Group10392"
                />
                <div className="mobile-menu">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="flex md:flex-1 sm:flex-col flex-row gap-6 sm:hidden items-start justify-center md:ml-[0] ml-[285px] w-[30%] md:w-full">
                <div className="flex flex-row gap-[11px] items-start justify-between w-[27%] sm:w-full">
                  <text
                    className="mt-[3px] text-base text-gray-900"
                    size="txtGilroyMedium16"
                  >
                    Products
                  </text>
                  <img
                    className="h-6 w-6"
                    src="images/img_arrowdown_gray_902.svg"
                    alt="arrowdown"
                  />
                </div>
                <div className="flex flex-row gap-[9px] items-start justify-center w-[28%] sm:w-full">
                  <text
                    className="mt-[3px] text-base text-gray-900"
                    size="txtGilroyMedium16"
                  >
                    Resouces
                  </text>
                  <img
                    className="h-6 w-6"
                    src="images/img_arrowdown_gray_902.svg"
                    alt="arrowdown One"
                  />
                </div>
                <text
                  className="sm:mt-0 mt-[5px] text-base text-gray-900"
                  size="txtGilroyMedium16"
                >
                  Request a demo
                </text>
              </div>
              <img
                className="h-14 md:h-auto sm:hidden md:ml-[0] ml-[392px] rounded-[50%] w-14"
                src="story.png"
                alt="ProfileimgLarg"
              />
            </div>
          </header>
          <div className="flex flex-col gap-8 items-center justify-end max-w-[1268px] mx-auto md:px-5 w-full">
            <div className="flex sm:flex-col flex-row md:gap-10 items-center justify-between w-full">
              <text
                className="text-2xl md:text-[22px] text-black-900 sm:text-xl"
                size="txtGilroySemiBold24"
              >
                People you may know
              </text>
              <Input
                name="Group10337"
                placeholder="Search Friends"
                value={group10337value}
                onChange={(e) => setGroup10337value(e)}
                className="font-medium p-0 placeholder:text-blue_gray-200 text-base text-blue_gray-200 text-left w-full"
                wrapClassName="bg-white-A700 border border-blue_gray-300 border-solid flex sm:flex-1 pl-4 py-[17px] rounded-lg sm:w-full"
                suffix={
                  group10337value?.length > 0 ? (
                    <CloseSVG
                      className="mt-[17px] mb-[15px] cursor-pointer h-5 ml-[35px] mr-4"
                      onClick={() => setGroup10337value("")}
                      fillColor="#bac1ce"
                      height={20}
                      width={20}
                      viewBox="0 0 20 20"
                    />
                  ) : (
                    <img
                      className="mt-[17px] mb-[15px] cursor-pointer h-5 ml-[35px] mr-4"
                      src="images/img_search_blue_A200.svg"
                      alt="search"
                    />
                  )
                }
              ></Input>
            </div>
            <div className="flex flex-col items-center justify-start w-full">
              <div className="md:gap-5 gap-8 grid sm:grid-cols-1 md:grid-cols-3 grid-cols-5 justify-center min-h-[auto] w-full">
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <img
                    className="h-[228px] md:h-auto object-cover w-[228px]"
                    src="images/img_profileimglarg.png"
                    alt="Rectangle1339"
                  />
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col gap-[13px] items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[7px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Rose J. Henry
                    </text>
                    <text
                      className="text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <img
                      className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                      src="images/img_profileimglarg_50X50.png"
                      alt="Rectangle1340"
                    />
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Kai Caudle
                    </text>
                    <text
                      className="mt-[19px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <img
                      className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                      src="images/img_rectangle1340.png"
                      alt="Rectangle1340 One"
                    />
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col gap-3.5 items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[7px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Jane Cooper
                    </text>
                    <text
                      className="text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <img
                      className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                      src="images/img_profileimglarg_2.png"
                      alt="Rectangle1340 Two"
                    />
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Wade Warren
                    </text>
                    <text
                      className="mt-[18px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <img
                      className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                      src="images/img_profileimglarg_3.png"
                      alt="Rectangle1340 Three"
                    />
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Leslie Alexander
                    </text>
                    <text
                      className="mt-[19px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <img
                      className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                      src="images/img_profileimglarg_4.png"
                      alt="Rectangle1340 Four"
                    />
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col gap-3.5 items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[7px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Jenny Wilson
                    </text>
                    <text
                      className="text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-1.5 rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat flex flex-col h-[228px] items-center justify-start rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <div
                      className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                      style={{
                        backgroundImage:
                          "url('images/img_profileimglarg_50X50.png')",
                      }}
                    >
                      <img
                        className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                        src="images/img_rectangle1341.png"
                        alt="Rectangle1341"
                      />
                    </div>
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Robert Fox
                    </text>
                    <text
                      className="mt-[18px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-1.5 rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat flex flex-col h-[228px] items-center justify-start rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <div
                      className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                      style={{
                        backgroundImage: "url('images/img_rectangle1340.png')",
                      }}
                    >
                      <img
                        className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                        src="images/img_rectangle1341_228X228.png"
                        alt="Rectangle1341 One"
                      />
                    </div>
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col gap-3.5 items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[7px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Jane Cooper
                    </text>
                    <text
                      className="text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-1.5 rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat flex flex-col h-[228px] items-center justify-start rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <div
                      className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                      style={{
                        backgroundImage: "url('images/img_profileimglarg_2.png')",
                      }}
                    >
                      <img
                        className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                        src="images/img_rectangle1341_1.png"
                        alt="Rectangle1341 Two"
                      />
                    </div>
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Jacob Jones
                    </text>
                    <text
                      className="mt-[18px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-1.5 rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-start w-full">
                  <div
                    className="bg-cover bg-no-repeat flex flex-col h-[228px] items-center justify-start rounded-tl-md rounded-tr-md w-[228px]"
                    style={{
                      backgroundImage: "url('images/img_profileimglarg.png')",
                    }}
                  >
                    <div
                      className="bg-cover bg-no-repeat h-[228px] relative rounded-tl-md rounded-tr-md w-[228px]"
                      style={{
                        backgroundImage: "url('images/img_profileimglarg_3.png')",
                      }}
                    >
                      <img
                        className="absolute h-[228px] inset-[0] justify-center m-auto object-cover rounded-tl-md rounded-tr-md w-[228px]"
                        src="images/img_rectangle1341_2.png"
                        alt="Rectangle1341 Three"
                      />
                    </div>
                  </div>
                  <div className="bg-white-A700 border border-blue_gray-50 border-solid flex flex-col items-start justify-end p-4 rounded-bl-md rounded-br-md w-full">
                    <text
                      className="mt-[5px] text-blue_gray-900 text-lg"
                      size="txtGilroySemiBold18"
                    >
                      Devon Lane
                    </text>
                    <text
                      className="mt-[18px] text-blue_gray-400 text-lg"
                      size="txtGilroyRegular18"
                    >
                      12 Mutual friends
                    </text>
                    <div className="flex flex-col gap-2 items-center justify-start mt-[13px] rounded-md w-full">
                      <button className="bg-blue-A700 cursor-pointer font-medium min-w-[196px] py-[11px] rounded-md text-center text-lg text-white-A700">
                        Add Friend
                      </button>
                      <button className="bg-blue_gray-100 cursor-pointer font-medium min-w-[196px] py-1.5 rounded-md text-blue_gray-400_01 text-center text-lg">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  
}
