#include "main.h"
#include <stdio.h>

/**
 * print_numbers - Print the number since 0 upto 9
 * Return: Always 0
 */

void print_numbers(void)

{
	char c;

	for (c = 0 ; c <= 9 ; c++)
	{
	_putchar(c);
	}
	_putchar('\n');
}
