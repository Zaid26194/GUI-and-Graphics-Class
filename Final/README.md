# Mandelbrot Set - Final

The Mandelbrot Set is the visual representation of an iterated function on the complex plane. The function is - f(x) = x^2 + c, 
where 'c' is the value of 'x' in the first iteration.
Depending on the starting value of 'x' the function has two results:
1. The function's value escape to infinity after a certain number of iterations or
2. The function's value remain <= 2 no matter how many iterations pass by.

E.g. if the value of 'x' is -1. On first iteration, we get -1^2 + -1 = 0. Plugging in 0 for 'x' in the second iteration, we get 
0^2 + -1 = -1. Then -1 is 'x' for the third iteration and then 0 for the fourth and it keeps going back and forth.
Therefore, when 'x' is -1 the function's value will remain <=2.

Now, if the value of 'x' is +1. On first iteration, we get 1^2 + 1 = 2. Plugging in 2 for 'x' in the second iteration, we get 
2^2 + 1 = 5. Then 5 is 'x' for the third iteration and then 26 for the fourth and eventually it becomes too large.
Therefore, when 'x' is 1 the function's value will escape to infinity.

On the graph, if the value keeps the function under 2 then the colour is green. Otherwise, 
depending on how fast it escapes to infinity, it is some shade of red.

You can click and drag the set around and also scroll to zoom in-n-out.

## Known Issues
1. The set is supposed to zoom in infinitely but due to limitation of 32-bit floats, I could only get it to zoom in so far.
2. On some browsers the set looks horribly low res and that's why I have added screenshots to the folder 
to show what it is supposed to look like.
