package main

import "testing"

func TestGolden(t *testing.T) {
	if 2+2 != 4 {
		t.Fatal("math broke")
	}
}
