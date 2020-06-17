# Copyright 2020 Tony Astolfi
#
import csv
import matplotlib.pyplot as plt
import matplotlib


with open('avail_model_85.csv') as fp:
   r = csv.reader(fp)
   d85 = [d for d in r]

d85 = [(int(n), float(p)) for n, p in d85[1:]]
(n_odd, a85_odd) = zip(*d85[:25])
(n_even, a85_even) = zip(*d85[25:])


with open('avail_model_94.csv') as fp:
   r = csv.reader(fp)
   d94 = [d for d in r]

a94 = [(int(n), float(p)) for n, p in d94[1:]]
(_, a94) = zip(*(a94 + [(0, 1.0)] * 12))


print(a94)
print(len(a94))

with open('avail_model_97.csv') as fp:
   r = csv.reader(fp)
   d97 = [d for d in r]

a97 = [(int(n), float(p)) for n, p in d97[1:]]
(_, a97) = zip(*(a97 + [(0, 1.0)] * 16))

print(a97)
print(len(a97))

clip = 10

n_odd = n_odd[:clip]
n_even = n_even[:clip]
a85_odd = a85_odd[:clip]
a85_even = a85_even[:clip]
a94 = a94[:clip]
a97 = a97[:clip]

plt.axes(ylabel='Availability (log10)')
plt.axes(xlabel='Cluster Size (N)')
plt.yscale('logit')

plt.scatter(n_odd, a85_odd)
plt.scatter(n_even, a85_even)
plt.scatter(n_odd, a94)
plt.scatter(n_odd, a97)

plt.grid()
#plt.ylim([0.5, 1.0])

line_a85_odd, = plt.plot(n_odd, a85_odd, label='Available(Host)=85% (odd N)')
line_a85_even, = plt.plot(n_even, a85_even, label='Available(Host)=85% (even N)')
line_a94, = plt.plot(n_odd, a94, label='Available(Host)=94% (3 wk/yr)')
line_a97, = plt.plot(n_odd, a97, label='Available(Host)=97% (1 wk/yr)')

#ax = plt.axes()

#ax.grid();
#ax.ticklabel_format(axis='y', style='plain')

plt.legend(handles=[line_a85_odd, line_a85_even, line_a94, line_a97])

plt.show()
