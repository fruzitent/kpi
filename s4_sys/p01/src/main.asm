        bits 16
; @see: https://ctyme.com/intr/rb-2270.htm
; org 0x7c00

        section .text
        global _start

_start:
        cli
        hlt

; @see: https://github.com/microsoft/MS-DOS/blob/main/v4.0/src/BOOT/MSBOOT.ASM#L526
        times ((512 -2) - ($ - $$)) db 0x00
        dw 0xaa55
