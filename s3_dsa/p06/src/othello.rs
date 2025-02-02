pub enum Side {
    Dark,
    Light,
}

pub struct Disk {
    pub side: Side,
}

pub type Square = Option<Disk>;

pub struct Board {
    pub squares: Vec<Square>,
    pub stride: usize,
}

impl Board {
    pub fn new(stride: usize) -> Self {
        assert!(stride >= 4 && stride % 2 == 0);
        let mut squares: Vec<_> = (0..stride.pow(2)).map(|_| None).collect();

        let half_stride = stride / 2;
        let top_left = (half_stride - 1) * stride + (half_stride - 1);
        let top_right = (half_stride - 1) * stride + half_stride;
        let bottom_left = half_stride * stride + (half_stride - 1);
        let bottom_right = half_stride * stride + half_stride;

        squares[top_left] = Some(Disk { side: Side::Light });
        squares[top_right] = Some(Disk { side: Side::Dark });
        squares[bottom_left] = Some(Disk { side: Side::Dark });
        squares[bottom_right] = Some(Disk { side: Side::Light });

        Self { squares, stride }
    }
}
