import React from "react"

export function ContainerCardWhite({ children }: any) {
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '15px'
        }}>
            {children}
        </div >
    )
}
