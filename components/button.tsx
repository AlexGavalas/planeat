import { FC, ButtonHTMLAttributes } from 'react';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    ...rest
}) => {
    return (
        <button className="button" {...rest}>
            {children}
        </button>
    );
};
