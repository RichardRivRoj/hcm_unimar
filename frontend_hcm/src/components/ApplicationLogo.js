'use client'

import Image from "next/image"

const ApplicationLogo = props => (
    <Image
        src="/logo.svg"
        alt="Application Logo"
        {...props}
    />
)

export default ApplicationLogo
