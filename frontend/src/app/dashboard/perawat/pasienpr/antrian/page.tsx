"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbarpr";

interface QueueType {
  queueNo: string;
  noId: string;
  name: string;
  time: string;
  doctor: string;
  action: string;
  status: "Menunggu" | "Sedang Dilayani" | "Selesai";
}

export default function QueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPageFromUrl = Number(searchParams.get("page")) || 1;
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab =
    pathname.includes("daftar-pasien")
      ? "daftar-pasien"
      : pathname.includes("rekam-medis")
      ? "rekam-medis"
      : "daftar-antrian";

  const rowsPerPage = 10;

  const [queues, setQueues] = useState<QueueType[]>([]);
  const [completedPatients, setCompletedPatients] = useState<QueueType[]>([]);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // DUMMY 30 DATA
  const createDummy = (): QueueType[] =>
    Array.from({ length: 30 }).map((_, i) => {
      const hour = 8 + Math.floor(i / 2);
      const minute = i % 2 === 0 ? "00" : "30";
      const endHour = minute === "00" ? hour : hour + 1;
      const endMinute = minute === "00" ? "30" : "00";

      return {
        queueNo: String(i + 1),
        noId: `ID-${1000 + i}`,
        name: `Pasien ${i + 1}`,
        doctor: i % 2 === 0 ? "dr. Sarah Aminah" : "dr. Budi Santoso",
        action:
          i % 3 === 0
            ? "Pemeriksaan Umum"
            : i % 3 === 1
            ? "Kontrol Rutin"
            : "Tindakan Khusus",
        status:
          i % 3 === 0
            ? "Menunggu"
            : i % 3 === 1
            ? "Sedang Dilayani"
            : "Menunggu",
        time: `${hour.toString().padStart(2, "0")}:${minute} - ${endHour
          .toString()
          .padStart(2, "0")}:${endMinute}`,
      };
    });

  // LOAD DAN FORCE-REPLACE DATA DUMMY BARU
  useEffect(() => {
    const dummy = createDummy();
    setQueues(dummy);
    localStorage.setItem("queues_v1", JSON.stringify(dummy));

    const p = localStorage.getItem("patients_v1");
    if (p) setCompletedPatients(JSON.parse(p));
  }, []);

  useEffect(() => {
    localStorage.setItem("queues_v1", JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem("patients_v1", JSON.stringify(completedPatients));
  }, [completedPatients]);

  const filteredQueues = queues.filter(
    (q) =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.noId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.queueNo.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredQueues.length / rowsPerPage);
  const startIdx = (currentPageFromUrl - 1) * rowsPerPage;
  const currentQueues = filteredQueues.slice(startIdx, startIdx + rowsPerPage);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToTab = (tab: string) => {
    router.push(`/dashboard/perawat/pasienpr/${tab}?page=1`);
  };

  const getStatusColor = (status: QueueType["status"]) => {
    switch (status) {
      case "Menunggu":
        return "bg-pink-100 text-pink-700 border border-pink-200";
      case "Sedang Dilayani":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Selesai":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "";
    }
  };

  const reorderQueueNumbers = (list: QueueType[]) => {
    return list.map((item, index) => ({
      ...item,
      queueNo: String(index + 1),
    }));
  };

  const handleStatusChange = (queueNo: string, newStatus: QueueType["status"]) => {
    const idx = queues.findIndex((q) => q.queueNo === queueNo);
    if (idx === -1) return;

    const item = { ...queues[idx], status: newStatus };

    if (newStatus === "Selesai") {
      const newQueues = queues.filter((q) => q.queueNo !== queueNo);
      const reordered = reorderQueueNumbers(newQueues);

      setQueues(reordered);
      setCompletedPatients((prev) => [...prev, item]);
      showToast("Pasien selesai dan dipindahkan ke daftar pasien.");
      return;
    }

    const newQueues = [...queues];
    newQueues[idx] = item;
    setQueues(newQueues);
    showToast(`Status diubah → ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow">
            {toast}
          </div>
        </div>
      )}

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

        <h1 className="text-2xl font-bold text-pink-900">Daftar Antrian</h1>

        {/* SEARCH + ADD */}
        <div className="mb-4 w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari No. Antrian / No. ID / Nama Pasien"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                goToPage(1);
              }}
              className="flex-1 py-2 rounded-lg border border-pink-200"
            />
          </div>

          <Button
            className="bg-pink-600 text-white hover:bg-pink-700"
            onClick={() =>
              router.push("/dashboard/perawat/pasienpr/antrian/tambah-antrian")
            }
          >
            + Tambah Antrian
          </Button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100">
              <tr>
                {[
                  "No. Antrian",
                  "No. ID",
                  "Nama Pasien",
                  "Jam",
                  "Dokter",
                  "Tindakan",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100">
              {currentQueues.map((q) => (
                <tr key={q.queueNo} className="hover:bg-pink-50">
                  <td className="px-4 py-3">{q.queueNo}</td>
                  <td className="px-4 py-3">{q.noId}</td>
                  <td className="px-4 py-3">{q.name}</td>
                  <td className="px-4 py-3">{q.time}</td>
                  <td className="px-4 py-3">{q.doctor}</td>
                  <td className="px-4 py-3">{q.action}</td>

                  <td className="px-4 py-3">
                    <select
                      value={q.status}
                      onChange={(e) =>
                        handleStatusChange(
                          q.queueNo,
                          e.target.value as QueueType["status"]
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(
                        q.status
                      )}`}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Sedang Dilayani">Sedang Dilayani</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPageFromUrl === i + 1
                  ? "bg-pink-600 text-white"
                  : "bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
