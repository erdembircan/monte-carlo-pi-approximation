# Monte Carlo Pi Approximation

[Live Demo](https://erdembircan.github.io/monte-carlo-pi-approximation/)

An interactive visualization of the Monte Carlo method for estimating the value of pi.

Random points are scattered uniformly across a unit square. A quarter circle of radius 1 is inscribed in the square. The ratio of points landing inside the quarter circle to the total number of points approximates pi/4, giving us:

**pi = 4 * (points inside circle) / (total points)**

As the number of samples increases, the approximation converges toward the true value of pi (3.14159...).

## Modes

- **Realtime** — Points appear one batch at a time with animation. Choose between normal and fast speed.
- **Non-realtime** — All points are computed at once in a background thread and rendered when complete.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
