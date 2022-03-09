export const currentDate = () => {
    const dateObj = new Date();
    return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${dateObj.getMonth() + 1
        }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}`;
};