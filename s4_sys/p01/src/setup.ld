ENTRY(_start)
OUTPUT_ARCH(i386)
OUTPUT_FORMAT(elf32-i386)

SECTIONS {
    /* @see: https://ctyme.com/intr/rb-2270.htm */
    .text 0x7c00 : {
        *(.text)
    }

    /* @see: https://github.com/microsoft/MS-DOS/blob/main/v4.0/src/BOOT/MSBOOT.ASM#L526 */
    .signature 0x7dfe : {
        SHORT(0xaa55)
    }
}
