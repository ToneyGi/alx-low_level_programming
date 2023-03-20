#include <unistd.h>

/**
 * main - Print "ad that peice art is useful" - Dora Korpar, 2015-10-19
 * followed by newline, to standard error
 * Return: 1 (success)
 */


int main(void)

{
	write(2, "and that piece of art is useful\" - Dora Korpar, 2015-10-19\n", 59);
	return (1);
}
