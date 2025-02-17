ENTRY(_start)
OUTPUT_ARCH(i386)
OUTPUT_FORMAT(elf32-i386)

MEMORY {
    /* @see: https://en.wikipedia.org/wiki/Master_boot_record#Sector_layout */
    text (rx) : ORIGIN = 0x7c00, LENGTH = 0x00e0
    data (rw) : ORIGIN = 0x7ce0, LENGTH = 0x00de
    dpt (rw) : ORIGIN = 0x7dbe, LENGTH = 0x0040
    sig (rw) : ORIGIN = 0x7dfe, LENGTH = 0x0002
}

SECTIONS {
    .text : {
        PROVIDE(_ld_text_start = .);
        *(.text);
        PROVIDE(_ld_text_end = .);
    } > text

    .data : {
        PROVIDE(_ld_data_start = .);
        *(.data);
        PROVIDE(_ld_data_end = .);
    } > data

    .bss : {
        PROVIDE(_ld_bss_start = .);
        *(.bss);
        PROVIDE(_ld_bss_end = .);
    } > data

    /* @see: https://en.wikipedia.org/wiki/Master_boot_record#Partition_table_entries */
    .partition_table : {
        LONG(0x80) /* bootable */
        BYTE(0x01) /* primary */
    } > dpt

    /* @see: https://github.com/microsoft/MS-DOS/blob/main/v4.0/src/BOOT/MSBOOT.ASM#L526 */
    .signature : {
        SHORT(0xaa55)
    } > sig
}
