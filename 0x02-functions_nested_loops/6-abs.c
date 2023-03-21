#include "main.h"

/**
 * _abs - computes the absolute value of a integer.
 * @n: The number to be computed.
 * Return: Ansolutee value of a number or zero
 */

int _abs(int c)

{
	if (c < 0)
	{
	int abs_val;

	abs_val = c * -1;
	return (abs_val);
	}
	return (c);
}
