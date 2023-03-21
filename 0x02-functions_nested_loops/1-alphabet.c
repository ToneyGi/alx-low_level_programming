#include "main.h"
/**
 * Print_alphabet - function that print alphabet in lower case
 *
 * Return: always 0
 */


void print_alphabet(void)
{
	char i;

	for (i = 0 ; i <= 'z' ; i++)
		_putchar(i);
	_putchar('\n');
}
