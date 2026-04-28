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

            // 👉 container tombol (biar ada jarak)
            actions: "flex gap-2 justify-center",

            // 👉 tombol confirm (kotak)
            confirmButton: "bg-green-500 px-6 py-2 text-white rounded-lg",

            // 👉 tombol cancel (kotak)
            cancelButton: "bg-red-500 px-6 py-2 text-white rounded-lg",
        },
        buttonsStyling: false,
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
