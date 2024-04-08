"use client";
import React, { FC } from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";
type Props = {};

const Page: FC<Props> = ({}) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Gamecamp - Admin"
          description="Gamecamp"
          keywords="riot,Valorant,League of legend"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
