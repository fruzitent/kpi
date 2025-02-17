        bits 16

        extern _ld_bss_end
        extern _ld_bss_start
        extern _ld_data_end
        extern _ld_data_start
        extern _ld_text_end
        extern _ld_text_start

        section .text
        global _start

_start:
        cli

; TODO: init regs
        mov sp, stack_top

memset:
        mov byte [dest+0], 0x00
        mov byte [dest+1], 0x00
        mov byte [dest+2], 0x00
        mov byte [dest+3], 0x00

memcpy:
        mov al, [source+0]
        mov [dest+3], al
        mov al, [source+1]
        mov [dest+2], al
        mov al, [source+2]
        mov [dest+1], al
        mov al, [source+3]
        mov [dest+0], al

_end:
        hlt

        section .data

source:
        db 10, 20, 30, 40

dest:
        times 4 db "?"

        section .bss

stack:
        resb 64

stack_top:
