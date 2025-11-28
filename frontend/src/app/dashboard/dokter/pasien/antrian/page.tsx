"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbardr";

interface QueueType {
  queueNo: string;
  name: string;
  rmNo: string;
  doctor: string;
  time: string;
}

export default function QueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // GET PAGE FROM URL
  const currentPageFromUrl = Number(searchParams.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState("");

  // Determine active tab
  const activeTab =
    pathname.includes("daftar-pasien")
      ? "daftar-pasien"
      : pathname.includes("rekam-medis")
      ? "rekam-medis"
      : "daftar-antrian";

  const rowsPerPage = 20;

  // Dummy data
  const queues: QueueType[] = Array.from({ length: 25 }).map((_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const endHour = hour + (minute === "00" ? 0 : 1);
    const endMinute = minute === "00" ? "30" : "00";

    return {
      queueNo: (i + 1).toString(),
      name: `Pasien Antrian ${i + 1}`,
      rmNo: i % 5 === 0 ? "-" : `008-0097${77 + i}`,
      doctor: i % 2 === 0 ? "dr. Sarah Aminah" : "dr. Budi Santoso",
      time: `${hour}:${minute} - ${endHour}:${endMinute}`,
    };
  });

  // Filter
  const filteredQueues = queues.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.rmNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.queueNo.includes(searchQuery)
  );

  // Pagination
  const totalPages = Math.ceil(filteredQueues.length / rowsPerPage);
  const startIdx = (currentPageFromUrl - 1) * rowsPerPage;
  const currentQueues = filteredQueues.slice(
    startIdx,
    startIdx + rowsPerPage
  );

  // PUSH PAGE TO URL
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Navigasi Tab — selalu reset to page=1
  const goToTab = (tab: string) => {
    router.push(`/dashboard/dokter/pasien/${tab}?page=1`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {[
            { label: "Daftar Pasien", value: "daftar-pasien" },
            { label: "Daftar Antrian", value: "daftar-antrian" },
            { label: "Rekam Medis", value: "rekam-medis" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => goToTab(tab.value)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeTab === tab.value
                  ? "bg-pink-600 text-white shadow-md"
                  : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-pink-900">Daftar Antrian</h1>

        {/* Search */}
        <div className="mb-4 w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari No. Antrian / No. RM / Nama Pasien"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                goToPage(1);
              }}
              className="flex-1 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-600 text-pink-900"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100 text-pink-900">
              <tr>
                {[
                  "No. Antrian",
                  "Nama Pasien",
                  "No. RM",
                  "Dokter",
                  "Jam Janji",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left font-semibold text-sm"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100">
              {currentQueues.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-pink-600"
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                currentQueues.map((queue, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-4 py-2">{queue.queueNo}</td>
                    <td className="px-4 py-2 font-medium">{queue.name}</td>
                    <td className="px-4 py-2">{queue.rmNo}</td>
                    <td className="px-4 py-2">{queue.doctor}</td>
                    <td className="px-4 py-2">{queue.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size="sm"
                className={`px-3 py-1 rounded-full ${
                  currentPageFromUrl === i + 1
                    ? "bg-pink-600 text-white"
                    : "border border-pink-200 hover:bg-pink-50"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
