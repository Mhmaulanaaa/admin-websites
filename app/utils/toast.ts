import Swal from "sweetalert2";

// base toast
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: {
        popup: "rounded-xl text-sm px-4 py-3 shadow-lg",
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

// reusable functions
export const toastSuccess = (message: string) => {
    Toast.fire({
        icon: "success",
        title: message,
    });
};

export const toastError = (message: string) => {
    Toast.fire({
        icon: "error",
        title: message,
    });
};

export const toastWarning = (message: string) => {
    Toast.fire({
        icon: "warning",
        title: message,
    });
};

export const toastInfo = (message: string) => {
    Toast.fire({
        icon: "info",
        title: message,
    });
};