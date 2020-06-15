use rand::distributions::{Distribution, Uniform};
use rand::Rng;

fn main() {
    let mut rng = rand::thread_rng();

    println!("N, Avail");

    let max_n = 25;
    let p_fail = 2;

    for n in 1..max_n {
        if n % 2 == 0 {
            continue;
        }
        let ntrials = 100_000_000i64;
        let mut n_ok_trials = 0i64;
        for _trial in 0..ntrials {
            let mut ok = 0;
            let available = Uniform::from(0..100);

            for i in 0..n {
                if available.sample(&mut rng) >= p_fail {
                    ok += 1;
                }
            }
            if ok + ok > n {
                n_ok_trials += 1;
            }
        }
        println!("{}, {}", n, (n_ok_trials as f64) / (ntrials as f64));
    }
    for n in 1..max_n {
        if n % 2 == 1 {
            continue;
        }
        let ntrials = 100_000_000i64;
        let mut n_ok_trials = 0i64;
        for _trial in 0..ntrials {
            let mut ok = 0;
            let available = Uniform::from(0..100);

            for i in 0..n {
                if available.sample(&mut rng) >= p_fail {
                    ok += 1;
                }
            }
            if ok + ok > n {
                n_ok_trials += 1;
            }
        }
        println!("{}, {}", n, (n_ok_trials as f64) / (ntrials as f64));
    }
}
