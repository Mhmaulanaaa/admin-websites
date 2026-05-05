import Swal from "sweetalert2";

// CONFIRM (YES / NO)
export const confirmAction = async (text: string) => {
    return await Swal.fire({
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yakin",
        cancelButtonText: "Tidak Yakin",
        reverseButtons: false,
        customClass: {
            popup: "rounded-3xl p-1 m-2 text-xs px-5",

            actions: "flex gap-2 justify-center",

            confirmButton: "bg-green-500 px-6 py-2 text-white rounded-lg",

            cancelButton: "bg-red-500 px-6 py-2 text-white rounded-lg",
        },
        buttonsStyling: false,
    });
};

// CONFIRM LOGOUT
export const confirmLogout = async () => {
    return await Swal.fire({
        title: "Logout Akun?",
        text: "Kamu akan keluar dari sesi saat ini",
        icon: "question",

        showCancelButton: true,
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",

        reverseButtons: true, // 🔥 UX lebih aman (batal di kanan)

        customClass: {
            popup: "rounded-3xl px-6 py-5 text-sm",
            title: "text-xs font-semibold text-gray-800",
            htmlContainer: "text-gray-500 mt-1",

            actions: "flex gap-3 justify-center mt-4",

            confirmButton:
                "bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2.5 text-white rounded-xl shadow hover:scale-105 transition-all",

            cancelButton:
                "bg-gray-200 px-6 py-2.5 text-gray-700 rounded-xl hover:bg-gray-300 transition",
        },

        buttonsStyling: false,

        showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
        },
    });
};

// SUCCESS
export const successAlert = (text: string) => {
    return Swal.fire({
        icon: "success",
        text,
        timer: 1500,
        showConfirmButton: false,
    });
};

// ERROR
export const errorAlert = (text: string) => {
    return Swal.fire({
        icon: "error",
        text,
    });
};
