"use client";

import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  deleteLaravelAccessToken,
  laravelAccessToken,
  laravelUrl,
  requestHeader,
} from "@/components/GlobalValues";
import { toast } from "sonner";
import LoadingSpinner from "@/components/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export interface LogoutResponse {
  success: boolean;
  status: number;
  msg: string;
}

export interface DeleteResponse {
  success: boolean;
  msg: string;
  id: string;
  status: number;
}

export interface Response {
  success: boolean;
  msg: string;
  responses: ResponseElement[];
  status: number;
}

export interface ResponseElement {
  id: string;
  case: string;
  reply: string;
  created_at: Date;
  updated_at: Date;
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<Response | null>();

  const deleteData = async (id: string) => {
    try {
      const res = await axios.delete(
        `${laravelUrl}/api/responses/response/${id}`,
        requestHeader()
      );
      const data: DeleteResponse = res.data;
      if (!data.success) {
        toast("Failed to delete");
        return;
      }
      fetchData();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
    }
  };

  const fetchData = async () => {
    setLoaded(false);
    try {
      const res = await axios.get(
        `${laravelUrl}/api/responses/responses`,
        requestHeader()
      );
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
        if (error.status == 401) {
          deleteLaravelAccessToken();
          window.location.href = "/login";
        }
      }
    } finally {
      setLoaded(true);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${laravelUrl}/api/auth/logout`, requestHeader());
      deleteLaravelAccessToken();
      window.location.href = "/login";
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
      deleteLaravelAccessToken();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (laravelAccessToken) {
      fetchData();
      return;
    }
    window.location.href = "/login";
  }, []);

  return (
    <>
      {loaded ? (
        <div className="space-y-8 max-w-3xl mx-6 lg:mx-auto py-10">
          <div className="flex justify-center text-center">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Daftar Perintah WhatsApp Bot
            </h2>
          </div>
          <Table>
            <TableCaption>
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-3 lg:w-full lg:justify-center lg:space-y-0 py-6">
                <Link className="w-full lg:w-auto" href="/tambah">
                  <Button className="w-full">Tambah Perintah</Button>
                </Link>
                <Button variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead className="w-[100px]">Perintah</TableHead>
                <TableHead className="w-[100px]">Pesan</TableHead>
                <TableHead className="text-center w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.responses.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell key={index + 1} className="font-medium">
                      {index + 1}.
                    </TableCell>
                    <TableCell key={item.case}> {item.case}</TableCell>
                    <TableCell key={item.reply}>
                      <span className="line-clamp-1">{item.reply}</span>
                    </TableCell>
                    <TableCell className="text-center w-full flex justify-center space-x-3">
                      <Link href={`/edit/${item.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Hapus</Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-xl lg:mx-auto lg:w-auto">
                          <DialogHeader>
                            <DialogTitle>Apakah anda yakin?</DialogTitle>
                            <DialogDescription className="py-4">
                              Permintaan ini tidak bisa di kembalikan (alias di
                              undo), data anda akan selamanya dihapus. Apakah
                              anda yakin?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => deleteData(item.id)}
                                variant="destructive"
                              >
                                <Trash2 />
                                <span>Hapus</span>
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Tutup</Button>
                              </DialogClose>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen scale-[2.25]">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
