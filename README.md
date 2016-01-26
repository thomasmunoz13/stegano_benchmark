# Stegano Benchmarks

In order to test performance of our tool of dissimulation and revelation of a message in an image (for our steganography project at Polytech Nice-Sophia)
I made this benchmark script, that can be used to mesure performance of any couple of tools which complied to the project specification (one folder for revelation and one for dissimulation with a build.sh script to build the tool).

More informations for this project can be found at [http://www.i3s.unice.fr/~mosser/teaching/15_16/ps5](http://www.i3s.unice.fr/~mosser/teaching/15_16/ps5)

The **bench.sh** will download the image dataset and will run the benchmark on it.

Once the benchmark is over (if you do it on the whole dataset it will be very long, it tooks 10 hours for me ...), you can run the **computing.sh** script that will apply the analyze.js file on your results (please don't pay attention on the analyze file, it's a big copy/paste of the first analyze function I've made in order to get the results faster) and display the results on the standard output.


**May the force be with you ...**
