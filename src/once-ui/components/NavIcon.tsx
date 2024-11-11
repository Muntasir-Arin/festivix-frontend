'use client';

import React, { useState, forwardRef, useRef, useEffect } from 'react';
import styles from './NavIcon.module.scss';
import { Flex, DropdownWrapper, DropdownProps, DropdownOptions } from '.';

interface NavIconProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    dropdownOptions?: DropdownOptions[];
    dropdownProps?: Omit<DropdownProps, 'options'> & { onOptionSelect?: (option: DropdownOptions) => void };

}

const NavIcon = forwardRef<HTMLDivElement, NavIconProps>(({
    className,
    style,
    onClick,
    dropdownOptions= [],
    dropdownProps // Include dropdownProps in destructuring
}, ref) => {
    const [isActive, setIsActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setIsActive(!isActive);
        if (onClick) {
            onClick();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setIsActive(false);
        }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            setIsActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (

        <DropdownWrapper
        ref={wrapperRef}
            dropdownOptions={dropdownOptions}
            dropdownProps={dropdownProps}>
        <Flex
            onKeyDown={handleKeyDown}
            ref={ref}
            tabIndex={0}
            radius="m"
            position="relative"
            className={`${styles.button} ${className || ''}`}
            style={{ ...style }}
            onClick={handleClick}>
            <div className={`${styles.line} ${isActive ? `${styles.active}` : ''}`} />
            <div className={`${styles.line} ${isActive ? `${styles.active}` : ''}`} />
        </Flex>
        </DropdownWrapper>
    );
});

NavIcon.displayName = 'NavIcon';

export { NavIcon };