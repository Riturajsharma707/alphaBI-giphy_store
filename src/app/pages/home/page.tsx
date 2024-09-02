"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Inter } from "next/font/google";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/components/ui/loading";
import { toast } from "react-toastify";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface card {
  id: number;
  title: string;
  image: string;
  username: string;
}

const inter = Inter({
  weight: ["500", "700"],

  subsets: ["latin-ext"],
});

const Homepage = () => {
  const [searchText, setSearchText] = useState("rose");
  const [data, setData] = useState<card[]>([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = data.slice(firstItemIndex, lastItemIndex);

  const favSVG = (
    <svg
      height={40}
      width={40}
      viewBox="0 0 76 76"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      baseProfile="full"
      enableBackground="new 0 0 76.00 76.00"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fill="#e7d513"
          fillOpacity="1"
          strokeWidth="0.2"
          strokeLinejoin="round"
          d="M 17.4167,32.25L 32.9107,32.25L 38,18L 43.0893,32.25L 58.5833,32.25L 45.6798,41.4944L 51.4583,56L 38,48.0833L 26.125,56L 30.5979,41.7104L 17.4167,32.25 Z "
        ></path>{" "}
      </g>
    </svg>
  );

  const addFav = (
    <svg
      viewBox="0 0 32 32"
      height={20}
      width={20}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g id="icomoon-ignore"> </g>{" "}
        <path
          d="M19.38 12.803l-3.38-10.398-3.381 10.398h-11.013l8.925 6.397-3.427 10.395 8.896-6.448 8.895 6.448-3.426-10.395 8.925-6.397h-11.014zM20.457 19.534l2.394 7.261-6.85-4.965-6.851 4.965 2.64-8.005-0.637-0.456-6.228-4.464h8.471l2.606-8.016 2.605 8.016h8.471l-6.864 4.92 0.245 0.744z"
          fill="#000000"
        >
          {" "}
        </path>{" "}
      </g>
    </svg>
  );

  const getData = async () => {
    const api_url = process.env.API_URL;
    const api_key = process.env.API_KEY;
    try {
      setLoader(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await axios.get(
        `${api_url}?q=${searchText}&api_key=${api_key}&limit=50`
      );

      // console.log(`${api_url}?q=${searchText}&api_key=${api_key}&limit=50`);
      const data = response.data;
      // console.log(38, data.data);
      setData(data.data);
      setLoader(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const searchHandle = async (event: any) => {
    event.preventDefault();
    setLoader(true);

    setSearchText(event.target.value);
    await getData();
    setCurrentPage(1);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoader(true);
    setCurrentPage(1);
    setSearchText(event.target.value);

    await getData();
  };

  const addDataToFirebase = async (item: any) => {
    try {
      const colle = await addDoc(collection(db, "favorite"), {
        item,
      });
      return true;
    } catch (error: any) {
      console.log("ERROR::", error);
      return false;
    }
  };

  const handleFavorite = async (item: any) => {
    // console.log(item);
    const added = await addDataToFirebase(item);
    if (added) {
      toast.success("Item successfully added");
      // console.log(added);
    } else {
      toast.error("Failed to add");
    }
  };

  return (
    <div className="min-h-full min-w-full bg-pink-50 mt-20 ">
      <div className=" p-2 md:p-10 bg-pink-100  mx-4 md:mx-20 mt-5">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex  w-full">
            <div className="absolute pt-3 px-2 ">
              <svg
                height={20}
                width={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="w-full">
              <Input
                placeholder="Article name or keywords..."
                className="text-xl pl-10"
                onKeyUp={searchHandle}
              />
            </div>
          </div>
          <Button type="submit" variant={"default"}>
            Search
          </Button>
        </form>
      </div>

      {loader ? (
        <div className="h-full flex items-center  p-2 md:p-10 bg-pink-100  mx-4 justify-center  md:mx-20  gap-5 overflow-hidden">
          <Loading />
        </div>
      ) : data.length != 0 ? (
        <div className="min-h-full p-2 md:p-10 bg-pink-100  mx-4  md:mx-20 flex flex-wrap gap-5 overflow-hidden">
          <div className="flex flex-wrap justify-center  gap-8">
            {currentItems.map((item: any) => (
              <Card key={item.id}>
                <img
                  src={item.images.original.url}
                  height={""}
                  width={""}
                  alt={item.title}
                  className=" h-48 min-w-full  rounded-lg"
                />

                <CardHeader>
                  {/* <CardTitle className="cursor-pointer"> */}
                  <abbr
                    title="Click to add in favorite"
                    className="cursor-pointer"
                    onClick={() => handleFavorite(item)}
                  >
                    {item.favoriteAdded == true ? favSVG : addFav}
                  </abbr>
                  {/* </CardTitle> */}
                  <CardTitle className={inter.className}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{`@${item.username}`}</CardContent>
              </Card>
            ))}
          </div>

          {data.length != 0 && (
            <PaginationSection
              totalItems={data.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

function PaginationSection({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems: any;
  itemsPerPage: any;
  currentPage: any;
  setCurrentPage: any;
}) {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      console.log(currentPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
      console.log(currentPage);
    }
  };

  const hanglePage = (currentPage: any) => {
    if (currentPage < totalItems / itemsPerPage + 2) {
      setCurrentPage(currentPage);
      console.log(totalItems);
      console.log(currentPage);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePrevPage()} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="hover:bg-pink-300 cursor-pointer"
            onClick={() => hanglePage(currentPage)}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="hover:bg-pink-300 cursor-pointer"
            onClick={() => hanglePage(currentPage + 1)}
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="hover:bg-pink-300 cursor-pointer"
            onClick={() => hanglePage(currentPage + 3)}
          >
            {currentPage + 2}
          </PaginationLink>
        </PaginationItem>
        <PaginationNext onClick={() => handleNextPage()} />
      </PaginationContent>
    </Pagination>
  );
}

export default Homepage;
