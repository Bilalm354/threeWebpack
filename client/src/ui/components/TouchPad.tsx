import React from "react"
import { Col } from "react-bootstrap"
import { keyboard } from "~/misc/Keyboard"

export const Touchpad = () => {
    return (
        <>
            <Col><div className="controls unselectable" id="go" onTouchStart={() => keyboard.up = true} onTouchEnd={() => keyboard.up = false}>Go</div></Col>
            <Col><div className="controls unselectable" id="stop" onTouchStart={() => keyboard.down = true} onTouchEnd={() => keyboard.down = false}>Stop</div></Col>
            <Col><div className="controls unselectable" id="turbo" onTouchStart={() => keyboard.space = true} onTouchEnd={() => keyboard.space = false}>Turbo</div></Col>
            <Col><div className="controls unselectable" id="left" onTouchStart={() => keyboard.left = true} onTouchEnd={() => keyboard.left = false}>Left</div></Col>
            <Col><div className="controls unselectable" id="right" onTouchStart={() => keyboard.right = true} onTouchEnd={() => keyboard.right = false}>Right</div></Col>
        </>
    )
}
