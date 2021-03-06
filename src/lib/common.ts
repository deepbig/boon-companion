export const checkProfanityWords = (user_string_input: string, profanityList: string[]) => {
    return new Promise(resolve => {
        if (user_string_input) {
            const words = user_string_input.split(' ');
            let i = -1;
            while (++i < words.length) {
                if (profanityList.indexOf(words[i]) > -1) {
                    resolve(true);
                    break;
                } else if (i === words.length - 1) {
                    resolve(false);
                }
            }
        } else {
            resolve(false);
        }
    })
};

export const currentDate = () => {
    const dateObj = new Date();
    return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${dateObj.getMonth() + 1
        }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}`;
};

export const currentDateTime = () => {
    const dateObj = new Date();
    return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${dateObj.getMonth() + 1
        }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}T${dateObj.getHours() < 10 ? '0' : ''}${dateObj.getHours()
        }:${dateObj.getMinutes() < 10 ? '0' : ''}${dateObj.getMinutes()}`;
};

export const isFound = (value: string, arr: string[]) => {
    const left = value.toLowerCase();
    return arr?.some((right) => left === right.toLowerCase());
};