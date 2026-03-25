<?php
$file = __DIR__ . '/counter.txt';

// если файла нет — создаем
if (!file_exists($file)) {
    file_put_contents($file, "0");
}

// читаем текущее значение
$count = (int)file_get_contents($file);

// увеличиваем
$count++;

// сохраняем
file_put_contents($file, $count);

// возвращаем число
echo $count;
