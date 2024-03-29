import numpy as np
from matplotlib import pyplot as plt
from numpy import typing as npt
from scipy.signal import lfilter

from src.task1 import get_coefficients


def main() -> None:
    sample_rate: int = 256
    time: int = 1

    amp: float = 1
    freq0: float = 3
    freq1: float = 20
    hshift: float = 0
    scale: int = 3
    vshift: float = 0

    dt: float = 1 / sample_rate

    rng: np.random.Generator = np.random.default_rng()
    denumerator, numerator = get_coefficients(rng)

    timespan: npt.NDArray[np.float64] = np.arange(0, time, dt, dtype=np.float64)
    inp0: npt.NDArray[np.float64] = amp * np.sin((2 * np.pi * freq0 * timespan) - hshift) + vshift
    inp1: npt.NDArray[np.float64] = amp * np.sin((2 * np.pi * freq1 * timespan) - hshift) + vshift
    out0: npt.NDArray[np.float64] = lfilter(numerator, denumerator, inp0)
    out1: npt.NDArray[np.float64] = lfilter(numerator, denumerator, inp1)

    inp2: npt.NDArray[np.float64] = inp0 + inp1
    out2: npt.NDArray[np.float64] = out0 + out1
    out3: npt.NDArray[np.float64] = lfilter(numerator, denumerator, inp2)

    inp3: npt.NDArray[np.float64] = inp0 * scale
    out4: npt.NDArray[np.float64] = out0 * scale
    out5: npt.NDArray[np.float64] = lfilter(numerator, denumerator, inp3)

    with plt.style.context("seaborn"):
        plot(timespan, inp0, inp1, inp2, inp3, out0, out1, out2, out3, out4, out5)


def plot(
    timespan: npt.NDArray[np.float64],
    inp0: npt.NDArray[np.float64],
    inp1: npt.NDArray[np.float64],
    inp2: npt.NDArray[np.float64],
    inp3: npt.NDArray[np.float64],
    out0: npt.NDArray[np.float64],
    out1: npt.NDArray[np.float64],
    out2: npt.NDArray[np.float64],
    out3: npt.NDArray[np.float64],
    out4: npt.NDArray[np.float64],
    out5: npt.NDArray[np.float64],
) -> None:
    _, (ax0, ax1, ax2, ax3) = plt.subplots(figsize=(16, 24), ncols=1, nrows=4)

    ax0.plot(timespan, inp0, label="In #0")
    ax0.plot(timespan, out0, label="Out #0")
    ax0.legend()
    ax0.set_title("Signal #0 (3 Hz)")
    ax0.set_xlabel("Time, $s$")
    ax0.set_ylabel("Voltage, $V$")

    ax1.plot(timespan, inp1, label="In #1")
    ax1.plot(timespan, out1, label="Out #1")
    ax1.legend()
    ax1.set_title("Signal #1 (20 Hz)")
    ax1.set_xlabel("Time, $s$")
    ax1.set_ylabel("Voltage, $V$")

    ax2.plot(timespan, inp2, label="In #0 + In #1")
    ax2.plot(timespan, out2, label="Out #0 + Out #1")
    ax2.plot(timespan, out3, label="Out (#0 + #1)", linestyle="dashed")
    ax2.legend()
    ax2.set_title("Additivity property")
    ax2.set_xlabel("Time, $s$")
    ax2.set_ylabel("Voltage, $V$")

    ax3.plot(timespan, inp3, label="In #0 * scale")
    ax3.plot(timespan, out4, label="Out #0 * scale")
    ax3.plot(timespan, out5, label="Out (#0 * scale)", linestyle="dashed")
    ax3.legend()
    ax3.set_title("Homogenity property")
    ax3.set_xlabel("Time, $s$")
    ax3.set_ylabel("Voltage, $V$")

    plt.show()


if __name__ == "__main__":
    main()
