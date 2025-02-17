ENTRY(_start)
OUTPUT_ARCH(i386)
OUTPUT_FORMAT(elf32-i386)

MEMORY {
    /* @see: https://en.wikipedia.org/wiki/Master_boot_record#Sector_layout */
    mbr (rx) : ORIGIN = 0x7c00, LENGTH = 0x01be
    dpt (rw) : ORIGIN = 0x7dbe, LENGTH = 0x0040
    sig (rw) : ORIGIN = 0x7dfe, LENGTH = 0x0002
}

SECTIONS {
    .text : {
        *(.text);
    } > mbr

    .data : {
        *(.data);
    } > mbr

    .bss : {
        *(.bss);
    } > mbr

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
