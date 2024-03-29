#include "main.h"
#include <stdio.h>

/**
 * print_to_98 - function to print natural number
 *
 * @n: function parameter
 *
 * Return: always 0
 */

void print_to_98(int n)
{
	int i;

	for (n >= 0 && n <= 98)
	{
		for (i = n ; i <= 98 ; i++)
		{
			printf("%d", i);
			if (i != 98)
				printf(", ");
		}
		printf('\n');
	}
	else if (n < 0)
	{
		for (i = n ; i <= 98 ; i++)
		{
			printf("%d", i);
			if (i != 98)
				printf(", ");
		}
		printf('\n');
	}
	else if (n > 98)
	{
		for (i = n ; i >= 9 ; i--)
		{
			printf("%d", i);
			if (i != 98)
				printf(", ");
		}
		printf('\n');
	}
	else if (n == 98)
	{
		printf("%d", n);
}
