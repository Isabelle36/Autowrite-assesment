export const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img src="/mainLogo.png" alt="Logo" className="w-10 h-10" />
          <div className="h-10 w-px rounded-full bg-gray-300 mx-2" />
          <span className="text-gray-700 text-base font-medium">
            Document Upload Portal
          </span>
        </div>
        <button className="bg-[#EDEEF7] text-gray-500 text-sm font-medium rounded-md px-4 py-2 shadow-none">
          Broker Logo
        </button>
      </div>
    </nav>
  );
};
