/* eslint-disable no-param-reassign */
const sizeValidate = (size) => {
    if (size >= 1024) {
        size = size / 1024;
        size = Math.round(size);

        if (size >= 1024) {
            size = size / 1024;
            size = Math.round(size);
            size = `${size} МБ`;

            return size;
        }

        size = `${size} КБ`;

        return size;
    }
};

export { sizeValidate };
