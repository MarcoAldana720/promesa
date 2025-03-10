"use client"

import { useEffect, useState } from 'react';
import Aside from '../components/client/Aside';
import Profile from '../components/client/Profile';
import MenuIcon from '../assets/MenuIcon';
import PowerIcon from '../assets/PowerIcon';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const searchParams = useSearchParams();
  const showProfile = searchParams.get('profile') === '1';
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateUserData = async () => {
    try {
      const response = await axios.get('/api/auth/profile', { withCredentials: true });
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateUserData();
  }, [pathname, searchParams]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      toast.success('Ha cerrado sesión exitosamente.');
      router.push('/');
    } catch (error) {
      console.log(error);
      toast.error('Error al cerrar sesión.');
    }
  };

  // Actualiza la función para tomar la inicial del apellido paterno o materno
  const getInitials = (nombres, apellidoPaterno, apellidoMaterno) => {
    const firstNameInitial = nombres ? nombres.charAt(0) : '';
    const lastNameInitial = apellidoPaterno ? apellidoPaterno.charAt(0) : (apellidoMaterno ? apellidoMaterno.charAt(0) : '');
    return firstNameInitial + lastNameInitial;
  };

  // Obtén las iniciales usando us_nombres, us_apellido_paterno y us_apellido_materno
  const initials = userData ? getInitials(userData.us_nombres, userData.us_apellido_paterno, userData.us_apellido_materno) : '';

  return (
    <div className="flex bg-slate-50">
      <Aside isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-1 overflow-hidden h-screen flex flex-col">
        <header className="h-20 px-5 bg-primary flex items-center justify-between text-white sticky top-0 z-10">
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            <MenuIcon width={20} />
          </button>
          <div className="flex-1 flex justify-end items-center gap-3">
            <Link href={`${pathname}?profile=1`} className="flex items-center gap-3" title="Perfil">
              <div className="text-sm text-right hidden md:block">
                {userData && (
                  <>
                    <p className="capitalize">
                      {userData.us_nombres}
                      {userData.us_apellido_paterno && ` ${userData.us_apellido_paterno}`}
                      {userData.us_apellido_materno && ` ${userData.us_apellido_materno}`}
                    </p>
                    <span className="text-xs capitalize">{userData.rol_descripcion}</span>
                  </>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-primary uppercase">
                {initials}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-white" title="Cerrar Sesión">
              <PowerIcon width={20} />
            </button>
          </div>
        </header>
        <main className="p-4 relative z-0 main">
          {children}
        </main>
      </div>

      <Profile userData={userData} show={showProfile} />
    </div>
  );
}
