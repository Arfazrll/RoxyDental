"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorNavbar from "@/components/ui/navbarpr";
import AuthGuard from "@/components/AuthGuard";
import {
  User, CreditCard, Phone, Mail, MapPin, Calendar, FileText, ArrowRight, BadgeCheck, Loader2
} from "lucide-react";
import Link from "next/link";
import { nurseProfileService, NurseProfile, ProfileCompletion, ShiftStatus, AccountStatus, LicenseInfo } from "@/services/nurse-profile.service";

function InfoItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    id: <CreditCard className="w-5 h-5 text-pink-600" />,
    badge: <BadgeCheck className="w-5 h-5 text-pink-600" />,
    file: <FileText className="w-5 h-5 text-pink-600" />,
    phone: <Phone className="w-5 h-5 text-pink-600" />,
    mail: <Mail className="w-5 h-5 text-pink-600" />,
    map: <MapPin className="w-5 h-5 text-pink-600" />,
    calendar: <Calendar className="w-5 h-5 text-pink-600" />,
  };

  return (
    <div className="flex items-center justify-between bg-pink-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="min-w-0">
        <p className="text-pink-400 text-xs font-semibold truncate">{label}</p>
        <p className="text-[#C2185B] font-bold text-base mt-1 truncate">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center shadow-md">
        {iconMap[icon]}
      </div>
    </div>
  );
}

function MedicalStaffDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletion | null>(null);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [profileRes, completionRes, shiftRes, accountRes, licenseRes] = await Promise.all([
        nurseProfileService.getProfile(),
        nurseProfileService.getProfileCompletion(),
        nurseProfileService.getCurrentShiftStatus(),
        nurseProfileService.getAccountStatus(),
        nurseProfileService.getLicenseInfo()
      ]);

      setProfile(profileRes.data);
      setCompletion(completionRes.data);
      setShiftStatus(shiftRes.data);
      setAccountStatus(accountRes.data);
      setLicenseInfo(licenseRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFF6F8] flex flex-col">
        <DoctorNavbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
        </main>
      </div>
    );
  }

  if (!profile || !completion || !accountStatus || !licenseInfo) {
    return (
      <div className="min-h-screen w-full bg-[#FFF6F8] flex flex-col">
        <DoctorNavbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-pink-900">Data tidak dapat dimuat</p>
        </main>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF6F8] flex flex-col">
      <DoctorNavbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 w-full">
        <section className="mb-8">
          <Card className="rounded-xl bg-white shadow-md w-full">
            <CardContent className="p-6">
              <div className="grid grid-cols-[1fr_4.5fr_1.5fr] gap-6 items-start w-full">
                <div className="flex flex-col w-full">
                  <p className="text-sm text-gray-500 mt-6">Status Akun</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-lg font-semibold ${accountStatus.isActive ? 'text-green-700' : 'text-red-700'}`}>
                      {accountStatus.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {accountStatus.isVerified && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                        Terverifikasi
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {accountStatus.isVerified ? 'Akun dan lisensi telah terverifikasi' : 'Lengkapi data SIP untuk verifikasi'}
                  </p>
                </div>

                <div className="flex flex-col w-full pr-4">
                  <p className="text-sm text-gray-500 mt-6">Kelengkapan Profil</p>
                  <div className="w-full mt-2">
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${completion.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {completion.percentage}% - {completion.percentage === 100 ? 'Sempurna' : completion.percentage >= 80 ? 'Hampir Sempurna' : 'Perlu Dilengkapi'}
                  </p>
                </div>

                <div className="flex flex-col w-full">
                  <p className="text-sm text-gray-500 mt-4">Status Shift</p>
                  <div className={`${shiftStatus?.status === 'On Duty' ? 'bg-pink-50' : 'bg-gray-100'} p-4 rounded-lg mt-2 w-full`}>
                    <p className={`text-sm font-semibold ${shiftStatus?.status === 'On Duty' ? 'text-pink-700' : 'text-gray-600'}`}>
                      {shiftStatus?.status || 'Off Duty'}
                    </p>
                    {shiftStatus?.status === 'On Duty' && shiftStatus.shift && shiftStatus.remainingTime && (
                      <p className="text-xs text-gray-500">
                        {shiftStatus.shift.startTime} - {shiftStatus.shift.endTime} · {shiftStatus.remainingTime.formatted} tersisa
                      </p>
                    )}
                    {shiftStatus?.status !== 'On Duty' && (
                      <p className="text-xs text-gray-500">Tidak ada shift aktif</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="bg-pink-600 px-6 py-4">
              <h3 className="text-white font-semibold tracking-wide">INFORMASI PROFIL</h3>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-8 mt-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-100">
                      <User className="w-12 h-12 text-pink-400" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                  <p className="text-sm text-gray-500 mt-1">{profile.role === 'PERAWAT' ? 'Perawat' : 'Tenaga Medis'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="ID Karyawan" value={profile.username} icon="id" />
                <InfoItem label="No. SIP" value={profile.sipNumber || '-'} icon="file" />
                <InfoItem label="No. STR" value={profile.sipNumber || '-'} icon="badge" />
                <InfoItem label="Email" value={profile.email} icon="mail" />
                <InfoItem label="Nomor Telepon" value={profile.phone} icon="phone" />
                <InfoItem label="Spesialisasi" value={profile.specialization || '-'} icon="map" />
                <InfoItem label="Bergabung Sejak" value={formatDate(profile.createdAt)} icon="calendar" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="bg-yellow-400 px-6 py-4">
              <h3 className="text-yellow-900 font-semibold tracking-wide">JADWAL & LISENSI</h3>
            </div>

            <CardContent className="p-6 flex flex-col justify-between">
              <div className="space-y-6 mt-5">
                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Status Praktik</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      licenseInfo.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      licenseInfo.status === 'EXPIRING_SOON' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {licenseInfo.status === 'ACTIVE' ? 'AKTIF' :
                       licenseInfo.status === 'EXPIRING_SOON' ? 'SEGERA BERAKHIR' :
                       'EXPIRED'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {accountStatus.shiftStatus === 'On Duty' ? 'Sedang Bertugas' : 'Tidak Bertugas'}
                    </span>
                  </div>
                </div>

                {licenseInfo.hasLicense && (
                  <>
                    <div>
                      <p className="text-sm text-yellow-900 font-semibold">Masa Berlaku SIP</p>
                      <p className="text-yellow-700 font-bold mt-1">
                        {formatDate(licenseInfo.startDate)} - {formatDate(licenseInfo.endDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-yellow-900 font-semibold">Sisa Masa Berlaku</p>
                      <div className="w-full bg-yellow-50 h-3 rounded-full overflow-hidden mt-2">
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-500" 
                          style={{ width: `${licenseInfo.remaining?.percentage || 0}%` }} 
                        />
                      </div>
                      <p className="text-xs text-right text-yellow-800 mt-1">
                        {licenseInfo.remaining?.formatted || '-'}
                      </p>
                    </div>
                  </>
                )}

                {!licenseInfo.hasLicense && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900">
                      Belum ada data lisensi SIP. Silakan lengkapi di pengaturan profil.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link href="/dashboard/perawat/kalenderpr">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                    Lihat Jadwal Lengkap
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-10">
          <p className="text-center text-sm text-gray-400">
            © 2025 RoxyDental - Platform Klinik Gigi Modern
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function MedicalStaffDashboard() {
  return (
    <AuthGuard requiredRole="PERAWAT">
      <MedicalStaffDashboardContent />
    </AuthGuard>
  );
}